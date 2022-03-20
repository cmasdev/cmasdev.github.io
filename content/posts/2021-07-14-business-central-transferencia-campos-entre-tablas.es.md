---
layout: post
title: "Business Central: Transferencia de campos entre tablas"
author: Christian Amado
date: 2021-07-14 12:09:52 -0400
category: [Aplicaciones de negocio]
tags: [AL, Dynamics 365 Business Central]
thumbnail-img: /img/posts/thumbnails/businesscentral.png
cover-img: /img/posts/cover/dynamics-365-business-central.svg
---

En este artículo mostraré cómo se realiza la trasnferencia de información de una tabla a otra para facilitarnos las vida. Recordemos que este tipo de sistemas no tiene tablas normalizadas en base de datos. Es por eso que deben tener algún método de manejo de información y protección de los mismos.

<!--more-->
*<font size="2">Versión: 2021 Wave 1 (KID: 5004715)</font>*

Vamos a centrarnos en dos tablas:
1. **Sales Header**: Sería un Pedido de Venta.
2. **Sales Invoice Header**: Sería la factura de venta legal (posterior al registro del punto anterior).

Para que esto sea práctico, utilizaré el campo **Gen. Bus. Posting Group** que tiene como definición:
```
field(74; "Gen. Bus. Posting Group"; Code[20])
{
    Caption = 'Gen. Bus. Posting Group';
    TableRelation = "Gen. Business Posting Group";

    trigger OnValidate()
    begin
        TestStatusOpen;
        if xRec."Gen. Bus. Posting Group" <> "Gen. Bus. Posting Group" then begin
            if GenBusPostingGrp.ValidateVatBusPostingGroup(GenBusPostingGrp, "Gen. Bus. Posting Group") then
                "VAT Bus. Posting Group" := GenBusPostingGrp."Def. VAT Bus. Posting Group";
            RecreateSalesLines(FieldCaption("Gen. Bus. Posting Group"));
        end;
    end;
}
```
Este es el código fuente de **Sales Header** entonces significa que en la tabla **Sales Invoice Header** también debe tener esa definición. Así que expondré aquí el código de la tabla nativa:
```
field(74; "Gen. Bus. Posting Group"; Code[20])
{
    Caption = 'Gen. Bus. Posting Group';
    TableRelation = "Gen. Business Posting Group";
}
```
La única diferencia es que en la primera tabla posee validaciones y en la segunda no. Ahora bien, nótese que tienen el mismo nombre y el mismo número de campo. Eso es porque transfieren datos de una tabla a otra y esos detalles deben coincidir. No pueden tener número diferentes ni nomrbes distintos.  

Ahora, ¿dónde interviene la transferencia de datos? -Interviene en el CodeUnit 80: **Sales-Post** específicamente en el siguiente procedimiento:
```
local procedure InsertInvoiceHeader(var SalesHeader: Record "Sales Header"; var SalesInvHeader: Record "Sales Invoice Header")
var
    SalesCommentLine: Record "Sales Comment Line";
    RecordLinkManagement: Codeunit "Record Link Management";
    SegManagement: Codeunit SegManagement;
    EInvoiceMgt: Codeunit "E-Invoice Mgt.";
    IsHandled: Boolean;
begin
    IsHandled := false;
    OnBeforeInsertInvoiceHeader(SalesHeader, SalesInvHeader, IsHandled);
    if IsHandled then
        exit;

    with SalesHeader do begin
        SalesInvHeader.Init();
        CalcFields("Work Description");
        SalesInvHeader.TransferFields(SalesHeader);

        SalesInvHeader."No." := "Posting No.";
        if "Document Type" = "Document Type"::Order then begin
            if SalesSetup."Ext. Doc. No. Mandatory" then
                TestField("External Document No.");
            SalesInvHeader."Pre-Assigned No. Series" := '';
            SalesInvHeader."Order No. Series" := "No. Series";
            SalesInvHeader."Order No." := "No.";
        end else begin
            if "Posting No." = '' then
                SalesInvHeader."No." := "No.";
            SalesInvHeader."Pre-Assigned No. Series" := "No. Series";
            SalesInvHeader."Pre-Assigned No." := "No.";
        end;
        if GuiAllowed and not HideProgressWindow then
            Window.Update(1, StrSubstNo(InvoiceNoMsg, "Document Type", "No.", SalesInvHeader."No."));
        SalesInvHeader."Source Code" := SrcCode;
        SalesInvHeader."User ID" := UserId;
        SalesInvHeader."No. Printed" := 0;

        if SalesHeader."Document Type" = SalesHeader."Document Type"::Invoice then
            SalesInvHeader."Draft Invoice SystemId" := SalesHeader.SystemId;

        OnInsertInvoiceHeaderOnBeforeSetPaymentInstructions(SalesHeader, SalesInvHeader);

        SetPaymentInstructions(SalesHeader);
        SalesInvHeaderInsert(SalesInvHeader, SalesHeader);

        UpdateWonOpportunities(SalesHeader);
        SegManagement.CreateCampaignEntryOnSalesInvoicePosting(SalesInvHeader);

        ApprovalsMgmt.PostApprovalEntries(RecordId, SalesInvHeader.RecordId, SalesInvHeader."No.");

        if SalesSetup."Copy Comments Order to Invoice" then begin
            SalesCommentLine.CopyComments(
                "Document Type".AsInteger(), SalesCommentLine."Document Type"::"Posted Invoice".AsInteger(), "No.", SalesInvHeader."No.");
            RecordLinkManagement.CopyLinks(SalesHeader, SalesInvHeader);
        end;
        EInvoiceMgt.InsertSalesInvoiceCFDIRelations(SalesHeader, SalesInvHeader."No.");
    end;
end;
```
La magia se produce en la línea que corresponde a:
```
SalesInvHeader.TransferFields(SalesHeader);
```

De esta manera se produce el intercambio de información de una tabla a otra.

**Ojo:** Todas las tablas que tienen la misma estructura que **Sales Header** deben tener los mismos campos cons su numeración y su nombre.

¡Espero resulte útil!